import React, { useContext, useState } from "react";
import { TempBlockServiceContext } from "../App";
import "../App.css"
import { getBlockDef } from "../blocks/Blocks";
import { BlockView } from "./BlockView";

interface BlockChangeDI {
  setBlockProperty: (path: any[], value: any) => void,
  removeBlockInList: (path: any[]) => void,
  addBlockInList: (path: any[], block: any) => void
}

interface Props {
  blocks: any[],
  blockChangeDI: BlockChangeDI
}

export const BlockEditorContext = React.createContext<BlockChangeDI | undefined>(undefined);

function BlockEditor(props: Props) {
  const tempBlockService = useContext(TempBlockServiceContext);
  return (
      <BlockEditorContext.Provider value={props.blockChangeDI}>
        {tempBlockService?.tempBlockState && <BlockView isTemp={true} data={tempBlockService.tempBlockState?.block} path={[]} def={getBlockDef(tempBlockService.tempBlockState?.block)!} ></BlockView>}
        <div className="xd">
          {props.blocks.map((item, i) => <BlockView data={item} def={getBlockDef(item)!} path={[i]}/>)}
        </div>
      </BlockEditorContext.Provider>
  );
}

export default BlockEditor;