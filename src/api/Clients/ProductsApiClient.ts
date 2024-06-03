import { SpendWiseClient } from "../Base/BaseApiClient";
import { ProductModel } from "../Models/ProductModel";

export const ProductsApiClient = {
  urlPath: "Products",

  getAllAsync(): Promise<ProductModel[]> {
    return SpendWiseClient.get<ProductModel[]>(
      this.urlPath + "/products"
    ).then((response) => response.data);
  },

  updateOneAsync(model:ProductModel): Promise<ProductModel> {
    return SpendWiseClient.put<ProductModel>(
      this.urlPath + "/" + model.id,
      model
    ).then((response) => response.data);
  },

  deleteOneAsync(id:number): Promise<any> {
    return SpendWiseClient.delete(
      this.urlPath + "/" + id
    ).then((response) => response.data);
  },
};
