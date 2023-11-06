export type PaginatedRequest<T extends Record<string, any> = {}> = T & {
  // Only one of offset or key should be set
  'pagination.key'?: string | number
  'pagination.offset'?: number

  'pagination.limit'?: number
  'pagination.reverse'?: boolean
  'pagination.count_total'?: boolean
}

export type PaginatedResponse<T extends Record<string, any>> = T & {
  pagination: {
    next_key?: string
    totla?: `${number}`
  }
}
