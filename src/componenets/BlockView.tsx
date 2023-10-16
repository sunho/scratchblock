import '../App.css';
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ExprPlaceholderSlot, ListPlaceholderSlot, TextPlaceholderSlot } from './Placeholders';
import { BlockColer, BlockDefinition, getBlockDef, Placeholder } from '../blocks/Blocks';
import { BlockEditorContext } from './BlockEditor';
import { cloneDeep } from 'lodash';
import { TempBlockServiceContext } from '../App';
import { deepEqual } from 'assert';

// if () {}
// for ([]) {}
// while ([]) {}
// void func([]) {}
// int func2(int,int) {}
// int [func]([int [hi], int [wor], ]) { }
// list 
// (placeholder) text (placeholder)

interface Props {
  data: any,
  path: any[],
  def: BlockDefinition,
  getRef?: any,
  onMouseUp?: any,
  onMouseLeave?: any,
  isTemp?: boolean,
  isPreview?: boolean
}

function getBgColor(blockColor?: BlockColer) {
  switch(blockColor) {
  // case "secondary": {
  //   return '#9333ea';
  // }
  // case "third": {
  //   return '#db2777';
  // }
  default:
      return '#2563eb';
  }
}

export function BlockView(props: Props) {
  const [dragging, setDragging] = useState(false);
  const blockEditorService = useContext(BlockEditorContext);
  const tempBlockService = useContext(TempBlockServiceContext);
  const onMouseDown = useCallback((e: any) => {
    if (props.isPreview) {
      const relX = e.clientX - e.target.getBoundingClientRect().left;
      const relY = e.clientY - e.target.getBoundingClientRect().top;
      tempBlockService!.setTempBlockState(
        {
          x: e.clientX,
          y: e.clientY,
          boxX: relX,
          boxY: relY,
          block: props.data
        }
      );
    } else if (!dragging && !props.isTemp) {
      setDragging(true);
      console.log(props.data);
      const relX = e.clientX - e.target.getBoundingClientRect().left;
      const relY = e.clientY - e.target.getBoundingClientRect().top;
      tempBlockService!.setTempBlockState(
        {
          x: e.clientX,
          y: e.clientY,
          boxX: relX,
          boxY: relY,
          block: props.data
        }
      );
      blockEditorService!.removeBlockInList(props.path);
      e.stopPropagation();
    }
  }, [props, dragging, tempBlockService]);
  
  useEffect(() => {
    const onMouseMove = (e:any) => {
      if (props.isTemp) { 
        const bb = cloneDeep(tempBlockService?.tempBlockState)!;
        bb.x = e.clientX;
        bb.y = e.clientY;
        tempBlockService?.setTempBlockState(bb); 
      }
    };
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    }
  }, [dragging]);

  useEffect(() => {
    const onMouseUp = (e:any) => {
      if (props.isTemp) {
        tempBlockService?.setTempBlockState(undefined);
      }
    };
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
    }
  });

  const comparePath = (path: any[], pathn: number[]) => {
    pathn = cloneDeep(pathn);
    const path2 = path.filter(x => (x !== 'body'));
    console.log("compare:", pathn, path2);
    return JSON.stringify(pathn) === JSON.stringify(path2);
  };
  const isActive = (tempBlockService?.activeBlock && !props.isPreview && !props.isTemp) ? comparePath(props.path, tempBlockService?.activeBlock) : false;
  const bgColor = isActive ? '#db2777' : getBgColor(props.def.color);
  const tbState = tempBlockService?.tempBlockState;
  const computedStyle = props.isTemp ? {pointerEvents: 'none' as 'none', position: 'absolute' as 'absolute', left: tbState!.x - tbState!.boxX, top: tbState!.y - tbState!.boxY} : {};
  return (
    <div ref={props.getRef} style={computedStyle} className="NestBlock">
      <div className="NestBlockPlaceholder" style={{backgroundColor: bgColor}} onMouseDown={onMouseDown} onMouseUp={props.onMouseUp}
      onMouseOut = {props.onMouseLeave}>
        {
          props.def.placeholders.map((ph) => {
            if (ph.type == 'list') {
              return <ListPlaceholderSlot path={props.path.concat(ph.fieldName)} items={props.data[ph.fieldName]}/>
            } else if (ph.type == 'label') {
              return <span style={{"margin": "0 5px", userSelect: 'none' as 'none'}}>{ph.text}</span>;
            } else if (ph.type == 'text') {
              return <TextPlaceholderSlot path={props.path.concat(ph.fieldName)} text={props.data[ph.fieldName]}/>
            } else {
              return <ExprPlaceholderSlot path={props.path.concat(ph.fieldName)} item={props.data[ph.fieldName]}/>
            }
          })
        }
      </div>
      {
        props.def.nested ? 
      <><div className='NestBlockBody'>
        <div className='NestBlockBodyBar' style={{backgroundColor: bgColor}}></div>
        <div className='NestBlockBodyBody'>
        {props.data.body && props.data.body.map((item: any, i: any) => (
          <BlockView key={i} path={props.path.concat(['body', i])} def={getBlockDef(item)!} data={item}
           onMouseUp={(e:any) => {
            if (tempBlockService!.tempBlockState && tempBlockService!.tempBlockState.block)  {
              blockEditorService!.addBlockInList(props.path.concat(['body', i]), tempBlockService!.tempBlockState.block);
            }
          }}
          />
        ))}
        </div>
      </div>
      <div className='NestBlockEnd' style={{backgroundColor: bgColor}}></div></> : <></>
      } 
    </div>
  );
}
