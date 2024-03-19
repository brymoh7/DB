// iLoginResponse.ts
export interface ILoginResponse {
  timeStamp: string;
  status: boolean;
  message: string;
  data: {
    email: string;
    token: string;
  };
}
