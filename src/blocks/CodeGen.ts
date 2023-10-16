function lowerToCode(block: any): any {
  const indentThing = (txt: string) => {
    const lines = txt.split('\n');
    return lines.map(x => '  ' + x).join('\n');
  };
  switch (block.type) {
    case "textLiteral":
      return `"${block.value.toString()}"`;
    case "numberLiteral":
      return block.value.toString();
    case "suffixIncrement":
      return `${lowerToCode(block.value)}++;`
    case "binaryExpr":
      return `${lowerToCode(block.left)} ${block.operator} ${lowerToCode(block.right)}`;
    case "identifier":
      return block.name.toString();
    case "varDeclare":
      return `${lowerToCode(block.varType)} ${block.varName} = ${lowerToCode(block.value)};`
    case "pointerSet":
      return `*${lowerToCode(block.left)} = ${lowerToCode(block.right)};`;
    case "addr":
      return `&${lowerToCode(block.value)}`;
    case "assign":
      return `${lowerToCode(block.left)} = ${lowerToCode(block.right)};`;
    case "if":
      return `if (${lowerToCode(block.condition)}) {\n${indentThing(block.body.map((x: any) => (lowerToCode(x))).join('\n'))}\n}`;
    case "equalTo":
      return `${lowerToCode(block.left)} == ${lowerToCode(block.right)}`;
    case "call":
      return `${block.funcName}(${block.arguments.map((x:any) => lowerToCode(x)).join(', ')});`
    case "func":
      return `${lowerToCode(block.retType)} ${block.funcName}(${block.parameters.map((x: any) => (lowerToCode(x))).join(', ')}) {\n`
       + indentThing(block.body.map((x: any) => (lowerToCode(x))).join('\n')) 
       + '\n}';
    case "intType":
      return 'int';
    case "intPtrType":
      return 'int*';
    case "arg":
      return `${lowerToCode(block.argType)} ${block.argName}`;    
    }
}

export function compilerToCCode(blocks: any[]) {
  return blocks.map((x: any) => lowerToCode(x)).join('\n');
}

