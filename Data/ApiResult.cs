using System.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using System.Reflection;

namespace WorldCities.Data
{
    public class ApiResult<T>
    {
        /// <summary>
        /// Private constructor called by the CreateAsync method
        /// </summary>
        private ApiResult(
            List<T> data,
            int count,
            int pageIndex,
            int pageSize,
            string sortColumn,
            string sortOrder,
            string filterColumn,
            string filterQuery)
        {
            Data = data;
            TotalCount = count;
            PageIndex = pageIndex;
            PageSize = pageSize;
            SortColumn = sortColumn;
            SortOrder = sortOrder;
            FilterColumn = filterColumn;
            FilterQuery = filterQuery;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
        }

        #region Methods
        /// <summary>
        /// Pages, sorts and/or filters a IQueryable source.
        /// </summary>
        /// <param name="source">An IQueryable source of generic type</param>
        /// <param name="pageIndex">Zero-based current page index</param>
        /// <param name="pageSize">The actual size of each page</param>
        /// <param name="sortColumn">The sorting column name</param>
        /// <param name="sortOrder">The sorting order ("ASC" or "DESC")</param>
        /// <param name="filterColumn">The filtering column name</param>
        /// <param name="filterQuery">The filtering query (value to lookup)</param>
        /// <returns>A object containing the paged/sorted/filtered result and all the relevant paging/sorting/filtering navigation info.</returns>
        public static async Task<ApiResult<T>> CreateAsync(
            IQueryable<T> source,
            int pageIndex,
            int pageSize,
            string sortColumn = null,
            string sortOrder = null,
            string filterColumn = null,
            string filterQuery = null)
        {
            var count = await source.CountAsync();

            if (!string.IsNullOrEmpty(filterColumn) &&
                !string.IsNullOrEmpty(filterQuery) &&
                IsValidProperty(filterColumn))
            {
                source = source.Where($"{filterColumn}.Contains(@0)", filterQuery);
            }

            if (!string.IsNullOrEmpty(sortColumn) &&
                IsValidProperty(sortColumn))
            {
                sortOrder = !string.IsNullOrEmpty(sortOrder) &&
                            sortOrder.ToUpper() == "DESC"
                            ? "DESC"
                            : "ASC";
                source = source.OrderBy($"{sortColumn} {sortOrder}");
            }

            source = source
                .Skip(pageIndex * pageSize)
                .Take(pageSize);
            var data = await source.ToListAsync();

            return new ApiResult<T>(
                data,
                count,
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery);
        }

        /// <summary>
        /// Checks if the given property name exists to protect against SQL injection attacks
        /// </summary>
        /// <param name="propertyName"></param>
        /// <param name="throwExceptionIfNotFound"></param>
        /// <returns></returns>
        public static bool IsValidProperty(string propertyName, bool throwExceptionIfNotFound = true)
        {
            var prop = typeof(T).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
            if (prop == null && throwExceptionIfNotFound)
                throw new NotSupportedException($"ERROR: Property '{propertyName}' does not exist.");
            return prop != null;
        }
        #endregion

        /// <summary>
        /// The data result.
        /// </summary>
        public List<T> Data { get; }

        /// <summary>
        /// Total items count.
        /// </summary>
        public int TotalCount { get; }

        /// <summary>
        /// Zero-based index of current page.
        /// </summary>

        public int PageIndex { get; }

        /// <summary>
        /// Number of items contained in each page.
        /// </summary>
        public int PageSize { get; }

        /// <summary>
        /// Sorting column name (or null if none set)
        /// </summary>
        public string SortColumn { get; }

        /// <summary>
        /// Sorting order ("ASC", "DESC" or null if none set)
        /// </summary>
        public string SortOrder { get; }

        /// <summary>
        /// Filter column name (or null if none set)
        /// </summary>
        public string FilterColumn { get; }

        /// <summary>
        /// Filter Query string (to be used within the given FilterColumn)
        /// </summary>
        public string FilterQuery { get; }

        /// <summary>
        /// Total pages count.
        /// </summary>
        public int TotalPages { get; }

        /// <summary>
        /// TRUE if the current page has a previous page,
        /// FALSE otherwise.
        /// </summary>
        public bool HasPreviousPage
        {
            get
            {
                return (PageIndex > 0);
            }
        }

        /// <summary>
        /// TRUE if the current page has a next page,
        /// FALSE otherwise
        /// </summary>
        public bool HasNextPage
        {
            get
            {
                return ((PageIndex + 1) < TotalPages);
            }
        }
    }
}