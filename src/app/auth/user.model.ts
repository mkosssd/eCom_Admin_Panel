export class IntUserData {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    public storeName: string,
    
    // private _tokenExpirationDate: Date
  ) { }
  get token() {
    // if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
    //   return null
    // }
    return this._token
  }
}