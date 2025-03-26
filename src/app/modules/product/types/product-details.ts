export interface ProductDetails {
  id: string;
  name: string;
  description: string;
  image: string;
  createdBy: {
    _id: string;
    fullName: string;
    emailId: string;
  };
  createdAt: string;
}
