import { IProductInsert } from "../dto/product-insert.dto"

export interface ICart {
    cart_id: string
    products: IProductInsert[]
}