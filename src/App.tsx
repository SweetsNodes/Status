import { useEffect, useState, FC } from "react";
import { nodes, interval, name } from "./config";

const App: FC = function () {
  let [data, setData] = useState<any[]>([]);
  let [update, setUpdate] = useState<number>(0);
  let [first, setFirst] = useState<boolean>(false);
  let uniqueData = Object.values(
    data.reduce((r: any, c: any) => {
      r[c.name] = c;
      return r;
    }, {})
  );

  useEffect(function () {
    if (!first) {
      setFirst(true);
      setUpdate(Date.now());
      nodes.map(function (node: any, index: number) {
        fetch(node.url + "/stats")
          .then((res: any) => res.json())
          .then((res: any) => {
            setData([
              ...new Set([
                {
                  id: index + 1,
                  name: node.name,
                  status: true,
                  ...res,
                },
                ...data,
              ]),
            ]);
          })
          .catch((e: any) => {
            console.error(e);
            setData([
              ...new Set([
                {
                  id: index + 1,
                  name: node.name,
                  status: false,
                },
                ...data,
              ]),
            ]);
          });
      });
    }

    setInterval(function () {
      setUpdate(Date.now());
      nodes.map(function (node: any, index: number) {
        fetch(node.url + "/stats")
          .then((res: any) => res.json())
          .then((res: any) => {
            setData([
              ...new Set([
                {
                  id: index + 1,
                  name: node.name,
                  status: true,
                  ...res,
                },
                ...data,
              ]),
            ]);
          })
          .catch((e: any) => {
            console.error(e);
            setData([
              ...new Set([
                {
                  id: index + 1,
                  name: node.name,
                  status: false,
                },
                ...data,
              ]),
            ]);
          });
      });
    }, interval * 1000);
  });

  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
              {name}
            </h1>
          </div>
          <div className="lg:w-2/3 w-full mx-auto overflow-auto">
            <table className="table-auto w-full text-left whitespace-no-wrap">
              <thead>
                <tr>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
                    Node
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    Network
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    CPU
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    RAM
                  </th>
                  <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                    Disk
                  </th>
                </tr>
              </thead>
              <tbody>
                {uniqueData?.map((res: any) => {
                  if (res.status)
                    return (
                      <tr key={res.name}>
                        <td className="border-t-2 border-gray-200 px-4 py-3 text-green-600">
                          {res.name}
                        </td>
                        <td className="border-t-2 border-gray-200 px-4 py-3">
                          {res.netrx} | {res.nettx}
                        </td>
                        <td className="border-t-2 border-gray-200 px-4 py-3">
                          {res.cpuload}%
                        </td>
                        <td className="border-t-2 border-gray-200 px-4 py-3">
                          {res.memused} / {res.memtotal}
                        </td>
                        <td className="border-t-2 border-gray-200 px-4 py-3">
                          {res.diskused} / {res.disktotal}
                        </td>
                      </tr>
                    );

                  if (!res.status)
                    return (
                      <tr key={res.name}>
                        <td className="border-t-2 border-gray-200 px-4 py-3 text-red-700">
                          {res.name}
                        </td>
                        <td className="border-t-2 border-gray-200 px-4 py-3">
                          0B | 0B
                        </td>
                        <td className="border-t-2 border-gray-200 px-4 py-3">
                          0%
                        </td>
                        <td className="border-t-2 border-gray-200 px-4 py-3">
                          0B / 0B
                        </td>
                        <td className="border-t-2 border-gray-200 px-4 py-3">
                          0B / 0B
                        </td>
                      </tr>
                    );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <hr />
      <footer className="mx-auto text-center font-semibold mt-5">
        <p>
          Updated at: {update} | Every {interval}seconds
        </p>
      </footer>
    </>
  );
};

export default App;
