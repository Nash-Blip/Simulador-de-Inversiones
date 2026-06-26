export function formatearRespuestaPaginada<T>(
  data: T[],
  totalItems: number,
  page: number,
  limit: number,
) {
  return {
    data,
    meta: {
      totalItems,
      itemCount: data.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    },
  };
}
