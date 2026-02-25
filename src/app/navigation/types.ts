export type RootStackParamList = {
  ProductsList: undefined;
  ProductsDetail: { productId: string };
  ProductsForm: { isEdit: boolean; productId?: string };
};
