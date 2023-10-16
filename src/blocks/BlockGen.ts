import cparse from "./cparse";
import { FuncBlock } from './Blocks';

function lowerToBlockList(exprs: any[]) {
  return exprs.map(x => lowerToBlock(x));
}

function lowerTypeToBlock(expr: any) : any {
  if (expr.type === 'PointerType' && expr.target.name === "int") {
    return {
      type: 'intPtrType'
    };
  }
  if (expr.name === "int") {
    return {
      type: 'intType'
    }
  }
  throw "asdf";
}

function lowerToBlock(expr: any) : any {
  switch (expr.type) {
  case "FunctionDeclaration": {
    return {
      funcName: expr.name,
      parameters: lowerToBlockList(expr.arguments),
      body: lowerToBlockList(expr.body),
      retType: lowerTypeToBlock(expr.defType),
      type: 'func'
    };
  }
  case "Definition": {
    return {
      argName: expr.name, 
      type: 'arg',
      argType: lowerTypeToBlock(expr.defType)
    };
    break;
  }
  case "GlobalVariableDeclaration":
  case "VariableDeclaration": {
    return {
      varName: expr.name,
      value: lowerToBlock(expr.value),
      type: "varDeclare",
      varType: lowerTypeToBlock(expr.defType)
    };
  }
  case "ExpressionStatement": {
    if (expr.expression.type === "SuffixExpression" && expr.expression.operator === "++") {
      return {
        value: lowerToBlock(expr.expression.value),
        type: "suffixIncrement"
      };
    }
    if (expr.expression.type === 'BinaryExpression' && expr.expression.left.operator === '*' && expr.expression.operator === '=') {
      return {
        left: lowerToBlock(expr.expression.left.value),
        right: lowerToBlock(expr.expression.right),
        type: "pointerSet"
      };
    }
    return lowerToBlock(expr.expression);
  }
  case "CallExpression": {
    return {
      funcName: expr.base.value,
      arguments: expr.arguments[0] ? lowerToBlockList(expr.arguments) : [],
      type: 'call'
    };
  }
  case "IfStatement": {
    return {
      condition: lowerToBlock(expr.condition),
      body: lowerToBlockList(expr.body),
      type: 'if'
    }
  }
  case "BinaryExpression": {
    if (expr.operator === '=') {
      return {
        left: lowerToBlock(expr.left),
        right: lowerToBlock(expr.right),
        type: "assign"
      };
    } else if (expr.operator === '==') {
      return {
        left: lowerToBlock(expr.left),
        right: lowerToBlock(expr.right),
        type: "equalTo"
      };
    } else {
      return {
        left: lowerToBlock(expr.left),
        right: lowerToBlock(expr.right),
        operator: expr.operator,
        type: "binaryExpr"
      };
    }
  }
  case "PrefixExpression": {
    if (expr.operator === '&') {
      return {
        type: 'addr',
        value: lowerToBlock(expr.value)
      };
    }
    break;
  }
  case "Literal": {
    if (typeof expr.value === "number") {
      return {
        value: expr.value,
        type: "numberLiteral"
      }
    } else {
      return {
        value: expr.value,
        type: "textLiteral"
      }
    }
  }
  case "Identifier": {
    return {
      name: expr.value,
      type: "identifier"
    };
  }
  }
  return undefined;
}

export function compileToBlocks(source: string) {
  const AST = cparse(source);
  console.log("AST: ");
  console.log(AST);
  const out = lowerToBlockList(AST);
  console.log("lowered: ");
  console.log(out);
  return out;
}
