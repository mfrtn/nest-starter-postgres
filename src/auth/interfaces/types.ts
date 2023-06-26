export type cachedData = {
  randomId: string;
  data: {
    mobile: string;
    randomKey: string;
  };
};

export type JWTPayload = {
  mobile: string;
  iat: number;
  exp: number;
};
