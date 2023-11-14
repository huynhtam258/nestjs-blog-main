type ProductType = "Electronics" | "Clothing" | "Furniture"

export class CreateProductDto {
    product_name: string;

    product_price: number;

    product_thumb: string;

    product_slug: string;
    
    product_description: string;

    product_type: ProductType;
}