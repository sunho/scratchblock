import { Block } from "typescript"

export interface ListPlaceholder {
  type: 'list',
  fieldName: string
}

export interface TextPlaceholder {
  type: 'text',
  fieldName: string
}

export interface ExprPlaceholder {
  type: 'expr',
  fieldName: string
}

export interface LabelPlaceholder {
  type: 'label',
  text: string
}

export interface TypePlaceholder {
  type: 'type',
  fieldName: string
}

export type Placeholder = ListPlaceholder | TextPlaceholder | ExprPlaceholder | LabelPlaceholder | TypePlaceholder;

export type BlockColer = 'primary' | 'secondary' | 'third';

export interface BlockDefinition {
  placeholders: Placeholder[],
  nested: boolean,
  type: string,
  color?: BlockColer,
}

export const FuncBlock: BlockDefinition = {
  placeholders: [
    {type: 'label', text: 'Define function'},
    {type: 'text', fieldName: 'funcName'},
    {type: 'label', text: 'parameters: '},
    {type: 'list', fieldName: 'parameters'},
    {type: 'label', text: 'return type: '},
    {type: 'expr', fieldName: 'retType'}
  ],
  nested: true,
  type: 'func'
};

export const ArgBlock: BlockDefinition = {
  placeholders: [
    {type: 'expr', fieldName: 'argType'},
    {type: 'text', fieldName: 'argName'},
  ],
  nested: false,
  type: 'arg'
};

export const VarDeclareBlock: BlockDefinition = {
  placeholders: [
    {type: 'label', text: 'Declare a '},
    {type: 'expr', fieldName: 'varType'},
    {type: 'label', text: ' variable '},
    {type: 'text', fieldName: 'varName'},
    {type: 'label', text: 'as '},
    {type: 'expr', fieldName: 'value'},
  ],
  nested: false,
  type: 'varDeclare'
};

export const SuffixIncrementBlock: BlockDefinition = {
  placeholders: [
    {type: 'label', text: 'Increment '},
    {type: 'expr', fieldName: 'value'},
  ],
  nested: false,
  color: 'secondary',
  type: 'suffixIncrement'
};

export const NumberLiteralBlock: BlockDefinition = {
  placeholders: [
    {type: 'text', fieldName: 'value'},
  ],
  nested: false,
  type: 'numberLiteral'
};

export const TextLiteralBlock: BlockDefinition = {
  placeholders: [
    {type: 'text', fieldName: 'value'},
  ],
  nested: false,
  type: 'textLiteral'
};

export const IdentifierBlock: BlockDefinition = {
  placeholders: [
    {type: 'text', fieldName: 'name'},
  ],
  nested: false,
  type: 'identifier'
};

export const BinaryExprBlock : BlockDefinition = {
  placeholders: [
   {type: 'expr', fieldName: 'left'},
   {type: 'text', fieldName: 'operator'},
   {type: 'expr', fieldName: 'right'}
  ],
  nested: false,
  type: 'binaryExpr'
}

export const AssignBlock : BlockDefinition = {
  placeholders: [
    {type: 'label', text: 'Set '},
    {type: 'expr', fieldName: 'left'},
    {type: 'label', text: ' to '},
    {type: 'expr', fieldName: 'right'}
  ],
  nested: false,
  type: 'assign'
}

export const IfBlock : BlockDefinition = {
  placeholders: [
    {type: 'label', text: 'If'},
    {type: 'expr', fieldName: 'condition'},
    {type: 'label', text: 'do'}
  ],
  color: 'third',
  nested: true,
  type: 'if'
}

export const EqtBlock : BlockDefinition = {
  placeholders: [
    {type: 'expr', fieldName: 'left'},
    {type: 'label', text: ' is equal to '},
    {type: 'expr', fieldName: 'right'}
  ],
  color: 'third',
  nested: false,
  type: 'equalTo'
}

export const IntTypeBlock : BlockDefinition = {
  placeholders: [
    {type: 'label', text: 'Integer'}
  ],
  nested: false,
  type: 'intType'
}

export const IntPtrTypeBlock : BlockDefinition = {
  placeholders: [
    {type: 'label', text: 'Pointer to Integer'}
  ],
  nested: false,
  type: 'intPtrType'
}

export const CallBlock : BlockDefinition = {
  placeholders: [
    {type: 'text', fieldName: 'funcName'},
    {type: 'list', fieldName: 'arguments'},
  ],
  nested: false,
  type: 'call'
}

export const AddrBlock : BlockDefinition = {
  placeholders: [
    {type: 'label', text: 'address of '},
    {type: 'expr', fieldName: 'value'}
  ],
  nested: false,
  type: 'addr'
}

export const PointerSet: BlockDefinition = {
  placeholders: [
    {type: 'label', text: 'Set the value where pointer'},
    {type: 'expr', fieldName: 'left'},
    {type: 'label', text: ' points at to '},
    {type: 'expr', fieldName: 'right'}
  ],
  nested: false,
  type: 'pointerSet'
}

const globalBlockDefs = [PointerSet, FuncBlock, ArgBlock, VarDeclareBlock, SuffixIncrementBlock, NumberLiteralBlock, TextLiteralBlock, IdentifierBlock, BinaryExprBlock, AssignBlock, IfBlock, EqtBlock, IntTypeBlock, CallBlock, AddrBlock, IntPtrTypeBlock];

export function getBlockDef(blockItem: any) {
  for (let i = 0; i < globalBlockDefs.length; i++) {
    if (globalBlockDefs[i].type == blockItem.type) {
      return globalBlockDefs[i];
    }
  }
  return undefined;
}


