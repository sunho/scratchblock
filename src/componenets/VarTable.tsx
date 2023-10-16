import { VarState } from "../blocks/BlockVM"


interface Props {
  varStates: VarState[]
}

export function VarTable(props: Props) {
  return (
    <div className="h-128 m-4">
    <table className="w-full text-sm text-left text-gray-400">
        <thead className=" uppercase bg-gray-100 bg-gray-700 text-gray-400">
            <tr>
                <th scope="col" className="py-3 px-6 rounded-l-lg">
                   Name
                </th>
                <th scope="col" className="py-3 px-6">
                  Type
                </th>
                <th scope="col" className="py-3 px-6 rounded-r-lg">
                  Value
                </th>
            </tr>
        </thead>
        <tbody>
          {props.varStates.map(vs => (
            vs.type === 'int' ? 
            <tr className="bg-gray-800">
                <th scope="row" className="py-4 px-6 font-medium whitespace-nowrap text-white">
                  {vs.name}
                </th>
                <td className="py-4 px-6">
                  Integer
                </td>
                <td className="py-4 px-6">
                  {vs.value}
                </td>
            </tr> :
            <tr className="bg-gray-800">
              <th scope="row" className="py-4 px-6 font-medium whitespace-nowrap text-white">
                {vs.name}
              </th>
              <td className="py-4 px-6">
                Pointer to Integer
              </td>
              <td className="py-4 px-6">
                {`Address of ${props.varStates[vs.value-1].name}`}
              </td>
          </tr>
            ))}
        </tbody>
    </table>
</div>
  );
}