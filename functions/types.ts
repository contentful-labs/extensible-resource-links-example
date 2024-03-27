
export type ResourcesSearchRequest = {
  type: 'resources.search'
  resourceType: string
  query: string
  limit?: number
  pages?: {
    nextCursor: string
  }
}

export type Scalar = string | number | boolean

export type ResourcesLookupRequest<L extends Record<string, Scalar | Scalar[]> = Record<string, Scalar | Scalar[]>> = {
  type: 'resources.lookup'
  lookupBy: L
  resourceType: string
  limit?: number
  pages?: {
    nextCursor: string
  }
}

export type ResourcesSearchResponse = {
  items: object[]
  pages: {
    nextCursor?: string
  }
}

export type ResourcesLookupResponse = ResourcesSearchResponse
