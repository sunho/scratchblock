import "./App.css";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { compileToBlocks } from "./blocks/BlockGen";
import CodeEditor from "@uiw/react-textarea-code-editor";
import BlockEditor from "./componenets/BlockEditor";
import Compile from "./componenets/Compile";
import Output from "./componenets/Output";

import { cloneDeep } from "lodash";
import { compilerToCCode } from "./blocks/CodeGen";
import Navbar from "./componenets/Navbar";
import { BlockVM, VarState } from "./blocks/BlockVM";
import { VarTable } from "./componenets/VarTable";
import { ClimbingBoxLoader } from 'react-spinners';
import axios from "axios";
const qs = require("qs");

const queryString = require('query-string');
const Flash = require("react-reveal/Flash");

interface TempBlockState {
  x: number;
  y: number;
  boxX: number;
  boxY: number;
  cand?: any[];
  block: any;
}

interface TempBlockService {
  activeBlock?: number[];
  tempBlockState: TempBlockState | undefined;
  setTempBlockState: any;
}

export const TempBlockServiceContext = React.createContext<
  TempBlockService | undefined
>(undefined);

function App() {
  const[loading, setLoading] = useState(false);
  const [blockMode, setBlockMode] = useState(false);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [activeBlock, setActiveBlock] = useState<number[] | undefined>(
    undefined
  );
  const [source, setSource] = useState("");
  const [varStates, setVarStates] = useState<VarState[]>([]);
  const vm = useRef<BlockVM>(new BlockVM([]));
  const [tempBlockState, setTempBlockState] = useState<
    TempBlockState | undefined
  >(undefined);
  const [output, setOutput] = useState("");
  useEffect(() => {
    const q = queryString.parse(window.location.search);
    if (q['id']) {
      console.log(q['id']);
      fetch('http://localhost:1001/' + q['id']).then(res => res.json()).then( res => {
        console.log(res);
        setSource(res as any);
        setBlocks(compileToBlocks(res));
      });
    }
  }, []);
  useEffect(() => {
    if (!blockMode) {
      try {
        const bb = compileToBlocks(source);
        setBlocks(bb);
        vm.current = new BlockVM(bb);
      } catch (e) {}
    }
  }, [source]);
  useEffect(() => {
    if (blockMode) {
      setSource(compilerToCCode(blocks));
    }
  }, [blocks]);
  useEffect(() => {
    setSource(`int main(int arg) {
    int var = 10;
    var = 52;
    var = 5;
    printf("hi");
  }`);
    setTimeout(()=>{
    setBlockMode(true);
    },100);

  }, [])
  const setBlockProperty = useCallback(
    (path: any[], value: any) => {
      const newBlocks = cloneDeep(blocks);
      let cur = newBlocks;
      while (path.length !== 0) {
        if (path.length === 1) {
          cur[path[0]] = value;
        } else {
          cur = cur[path[0]];
        }
        path.shift();
      }
      setBlocks(newBlocks);
    },
    [blocks]
  );
  const removeBlockInList = useCallback(
    (path: any[]) => {
      const newBlocks = cloneDeep(blocks);
      let cur = newBlocks;
      while (path.length !== 0) {
        if (path.length === 1) {
          cur.splice(path[0], 1);
        } else {
          cur = cur[path[0]];
        }
        path.shift();
      }
      setBlocks(newBlocks.slice(0));
    },
    [blocks]
  );
  const addBlockInList = useCallback(
    (path: any[], block: any) => {
      const newBlocks = cloneDeep(blocks);
      let cur = newBlocks;
      while (path.length !== 0) {
        if (path.length === 1) {
          cur.splice(path[0], 0, block);
        } else {
          cur = cur[path[0]];
        }
        path.shift();
      }
      setBlocks(newBlocks.slice(0));
    },
    [blocks]
  );
  const blockChangeDI = {
    setBlockProperty,
    removeBlockInList,
    addBlockInList,
  };

  const stepVM = () => {
    vm.current.step();
    setActiveBlock(cloneDeep(vm.current.pc));
    setVarStates(cloneDeep(vm.current.varStates));
  };
  const share = () => {
    const id = Math.floor(Math.random()*100000000).toString();
    fetch("http://localhost:1001/insert", {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'id': id, 'code': source})});
    alert("http://localhost:3000/?id="+ id);
  };
  const compile = () => {
    const data = qs.stringify({
      code: "#include<stdio.h>\n" + source,
      language: "c",
      input: "",
    });
    const config = {
      method: "post",
      url: "https://codex-api.herokuapp.com/",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    
    axios(config)
      .then(function (response: any) {
        setOutput(output+'\n'+ response.data['output']);
      });
  }
  return (
      loading ? <div className="flex justify-center full-h align-center">
      <ClimbingBoxLoader 
      size = {30}
      loading = {loading}
      color = {"#8FBCBB"} /> 
      </div>: 
        <TempBlockServiceContext.Provider
          value={{
            activeBlock: activeBlock,
            tempBlockState,
            setTempBlockState,
          }}
        >
          <div className="flex mx-8 flex-col">
            <div className="h-20 flex items-center gap-4">
            <button type="button" onClick={compile} style={{backgroundColor: "#8FBCBB"}} className="text-black text-sm leading-6 font-medium py-2 px-3 rounded-lg">{"<> Compile"}</button>
            <button type="button" onClick={stepVM} style={{backgroundColor: "#2E3440"}} className="text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg">{"> Step"}</button>
            {/* <button type="button" onClick={share} style={{backgroundColor: "#2E3440"}} className="text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg">Share</button> */}
            </div>
            <div className="flex flex-1 gap-8">
            <div className="outputScreen flex flex-col">
          <div className="flex flex-col flex-1" style={{backgroundColor: "#1C2333",  borderRadius: '10px'}}>
     
            <div className="flex-1 text-white text-m m-8"> 
              {output}
            </div>
            <VarTable varStates={varStates}/>
            </div>
            </div>
            <div className="flex-1 flex flex-col gap-8">
              <div className="flex-1">
                <Flash>
                  {/* <div className = "top-bar"> */}
                  <CodeEditor
                    value={source}
                    onFocus={() => {
                      setBlockMode(false);
                    }}
                    onBlur={() => {
                      setBlockMode(true);
                    }}
                    language="c"
                    onChange={(evn: any) => setSource(evn.target.value)}
                    style={{
                      height: "41.5vh",
                      overflow: 'auto',
                      fontSize: 20,
                      borderRadius: '10px',
                      backgroundColor: "#1C2333",
                      fontFamily: "Gemunu Libre, sans-serif",
                    }}
                  />
                  {/* </div> */}
                </Flash>
              </div>
              <div className="flex-1">
                <Flash>
                  <div
                  className="overflow-auto"
                    style={{backgroundColor: "#1C2333",  borderRadius: '10px', height: '41.5vh'}}
                  >
                  <div className="m-4"> 
                  <BlockEditor blocks={blocks} blockChangeDI={blockChangeDI} />
                  </div>
           
                  </div>
                  {/* <Output/> */}
                </Flash>
              </div>
            </div>
            </div>
          </div>
        </TempBlockServiceContext.Provider>
  );
}

export default App;
