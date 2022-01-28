export default class Stack<TType> {
  private _items : Array<TType>;
  
  constructor(items: TType[] | undefined) {
    this._items = [];

    if(items)
      this._items = [ ...items ];
  }

  push(item: TType) : void {
    this._items.push(item);
  }

  isEmpty() : boolean {
    return this._items.length <= 0;
  }

  peek() : TType | undefined {
    if(!this.isEmpty())
      return this._items[this._items.length - 1];
    return undefined;
  }

  pop() : TType | undefined {
    if(!this.isEmpty())
      return this._items.pop();
    return undefined;
  }
}