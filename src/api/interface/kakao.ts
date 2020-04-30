interface KUserResponse {
  _raw: string;
  _json: {
    properties: { nickname: string };
    id: number;
    kakao_account: {
      email: string;
    };
  };
}
