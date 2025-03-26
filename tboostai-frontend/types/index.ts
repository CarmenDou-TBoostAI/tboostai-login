export interface Listing {
    id: string
    building_id: string
    price: number
    address: string
    neighborhood: string
    bedrooms: number | null
    bathrooms: number | null
    building_name?: string  // 可选字段
    borough?: string
    zipcode?: string
    property_type?: string
    sqft?: number
    description?: string
    no_fee: boolean
    agent_name?: string
    built_in?: number
    image_urls?: string[]
    video_urls?: string[]
    floorplan_urls?: string[]
    is_recommended?: boolean
}
  
export type Building = string