import React, { useContext } from "react";
import { getBlockDef } from "../blocks/Blocks";
import { BlockEditorContext } from "./BlockEditor";
import { BlockView } from "./BlockView";

interface ListPlaceholderSlotProps {
  items: any[],
  path: any[]
}

export function ListPlaceholderSlot(props: ListPlaceholderSlotProps) {
  return (
    <div className='ListHolder'>
      {props.items.map((x,i) => <BlockView path={props.path.concat(i)} data={x} def={getBlockDef(x)!}></BlockView>)}
    </div>
  )
}

interface TextPlaceholderSlotProps {
  text: string,
  path: any[]
}

export function TextPlaceholderSlot(props: TextPlaceholderSlotProps) {
  const blocksChangeDI = useContext(BlockEditorContext);
  return (
    <input className='TextHolder' onMouseDown={e => {
      e.stopPropagation();
    }} value={props.text} onChange={e => {
      blocksChangeDI!.setBlockProperty(props.path, e.target.value);
    }}/>
  )
}

interface ExprPlaceholderSlotProps {
  item: any,
  path: any[]
}

export function ExprPlaceholderSlot(props: ExprPlaceholderSlotProps) {
  return (
    <div className="ExprHolder">
    <BlockView path={props.path} data={props.item} def={getBlockDef(props.item)!}></BlockView>
    </div>
  );
}

