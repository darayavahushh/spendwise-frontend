import { SpendWiseClient } from "../Base/BaseApiClient";
import { ProductModel } from "../Models/ProductModel";

export const ProductsApiClient = {
  urlPath: "products",

  getAllAsync(): Promise<ProductModel[]> {
    return SpendWiseClient.get<ProductModel[]>(
      this.urlPath
    ).then((response) => response.data);
  },

  deleteOneAsync(id:number): Promise<any> {
    return SpendWiseClient.delete(
      this.urlPath + "/" + id
    ).then((response) => response.data);
  },
};
