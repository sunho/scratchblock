export type BlockCursor = number[];

export type VarType = 'int' | 'intPtr';

export interface VarState {
  name: string,
  type: VarType,
  value: any
};

export class BlockVM {
  pc: BlockCursor = [0];
  code: any[] = [];
  curLevel: number = 0;
  curStackToPop: number[] = [0];
  enteredScope: boolean = false;
  varStates: VarState[] = [];
  varStateMap: Map<string, number> = new Map();
  constructor(code: any) {
    this.code = code;
  }

  step() {
    this.enteredScope = false;
    console.log(this.code);
    console.log('pc', this.pc);
    this.evaluate(this.getCurBlock());
    if (this.enteredScope) 
      return false;
    return this.pushPc();
  }

  pushPc(): boolean {
    if (this.curLevel === 0) {
      if (this.pc[0] === this.code.length-1) {
        return true;
      }
      this.pc[0]++;
      return false;
    }
    const pBlock = this.getCurParentBlock();
    if (this.pc[this.pc.length-1] === pBlock.body.length - 1) {
      this.curLevel--;
      for (let i = 0; i < this.curStackToPop[this.curStackToPop.length-1]; i++) {
        this.varStateMap.delete(this.varStates[this.varStates.length-1].name);
        this.varStates.pop();
      }
      this.curStackToPop.pop();
      this.pc.pop();
      return this.pushPc();
    }
    this.pc[this.pc.length-1]++;
    return false;
  }

  enterScope() {
    this.pc.push(0);
    this.curLevel++;
    this.enteredScope = true;
    this.curStackToPop.push(0);
  }

  declareVariable(varState: VarState) {
    this.curStackToPop[this.curStackToPop.length-1]++;
    this.varStates.push(varState);
    this.varStateMap.set(varState.name, this.varStates.length-1);
  }

  getCurBlock() {
    let curBlock = this.code[this.pc[0]];
    for (let i = 1; i < this.pc.length; i++) 
      curBlock = curBlock.body[this.pc[i]];
    return curBlock;
  }

  getCurParentBlock() {
    if (this.pc.length === 1) 
      return undefined;
    let curBlock = this.code[this.pc[0]];
    for (let i = 1; i < this.pc.length-1; i++) 
      curBlock = curBlock.body[this.pc[i]];
    return curBlock;
  }

  evaluate(block: any) : any {
    switch(block.type) {
    case "identifier":
      if (!this.varStateMap.has(block.name))
        throw "couldn't find a variable: " + block.name;
      return this.varStates[this.varStateMap.get(block.name)!].value;
    case "binaryExpr": {
      const left: any = this.evaluate(block.left);
      const right: any = this.evaluate(block.right);
      switch(block.operator) {
      case "+":
        return left + right;
      case "-":
        return left -  right;
      case "/":
        return left / right;
      case "*":
        return left * right;
      }
      throw "unsupported operator: " + block.operator;
    }
    case "pointerSet": {
      if (block.left.type != 'identifier') 
        throw "assigning to non-identifier";
      const deref = this.evaluate(block.left)-1;
      const right: any = this.evaluate(block.right);
      if (deref >= this.varStates.length)
        throw "couldn't find a variable: " + deref.toString();
      this.varStates[deref].value = right;
      return undefined;
    }
    case "addr": {
      if (block.value.type != 'identifier') 
        throw "assigning to non-identifier";
      if (!this.varStateMap.has(block.value.name))
        throw "couldn't find a variable: " + block.value.name;
      return this.varStateMap.get(block.value.name) as any+1;
    }
    case "assign": {
      if (block.left.type != 'identifier') 
        throw "assigning to non-identifier";
      const right: any = this.evaluate(block.right);
      if (!this.varStateMap.has(block.left.name))
        throw "couldn't find a variable: " + block.left.name;
      this.varStates[this.varStateMap.get(block.left.name)!].value = right;
      return undefined;
    }
    case "numberLiteral": {
      return block.value;
    }
    case "suffixIncrement": {
      if (block.value.type != 'identifier') 
        throw "assigning to non-identifier";
      if (!this.varStateMap.has(block.value.name))
        throw "couldn't find a variable: " + block.value.name;
      this.varStates[this.varStateMap.get(block.value.name)!].value++;
      return undefined;
    }
    case "equalTo": {
      return this.evaluate(block.left) === this.evaluate(block.right);
    }
    case "varDeclare": {
      const vs: VarState = {
        name: block.varName,
        value: this.evaluate(block.value),
        type: block.varType.type === 'intType' ? 'int' : 'intPtr'
      };
      this.declareVariable(vs);
      return undefined;
    }
    case "func": {
      if (block.funcName === 'main') {
        this.enterScope();
        return undefined;
      } else {
        return undefined;
      }
    }
    case "if": {
      if (this.evaluate(block.condition)) {
        this.enterScope();
        return undefined;
      } else {
        return undefined;
      }
    }
    }
    return undefined;
  }
};