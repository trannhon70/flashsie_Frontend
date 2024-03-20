"use client";
import { Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import * as flashCardAPI from "@/apis/flashcards";
import * as flashCardAPINew from "@/apisNew/flashcards";
import { alert } from "@/utils/helpers";
var xlsx = require("xlsx");

import * as flashsetsAPI from "@/apis/flashsets";

export default function ImportCards({
  flashsetId,
  className = "",
  accept = ".xls, .xlsx",
  onDone,
  isOpen,
}) {
  const [open, setOpen] = useState(isOpen || false);
  const [loading, setLoading] = useState(false);
  const id = useRef(new Date().toISOString());
  const inputFileRef = useRef(null);

  const handleFile = (evt) => {
    evt.preventDefault();

    const file = evt.target.files[0];

    if (file) {
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      reader.onload = (e) => {
        const bstr = e.target.result;
        const wb = xlsx.read(bstr, { type: rABS ? "binary" : "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

        let cards = [];
        for (let index = 1; index < data.length; index++) {
          const element = data[index];
          if (element[0] && element[1]) {
            cards.push({
              flashsetId,
              name: `Card ${index}`,
              frontText: element[0],
              backText: element[1],
            });
          }
        }

        if (cards.length === 0) {
          alert.error("Your data file is empty");
          return;
        }
        if (cards.length > 100) {
          alert.error("Must not exceed 100 cards");
          cards = [];
          return;
        }
        setLoading(true);
        flashCardAPINew
          .importCard(cards, flashsetId)
          .then((res) => {
            setLoading(false);
            alert.success(
              `${cards.length}/${data.length - 1} cards has been imported successfully!`
            );
            onDone?.();
            document.getElementById(id.current).value = null;
            cards = [];
          })
          .catch((err) => {
            setLoading(false);
            document.getElementById(id.current).value = null;
            if (err.response.data.message === "") {
              alert.error("Failed to import");
            } else {
              alert.error(`${err.response.data.message}`);
            }
            cards = [];
          });
        cards = [];
      };
      if (rABS) reader.readAsBinaryString(file);
      else reader.readAsArrayBuffer(file);
      //   reader.readAsArrayBuffer(evt.target.files[0])
    }
  };

  return (
    <>
      <label
        htmlFor={id.current}
        onChange={handleFile}
        className={className}
        style={{ cursor: "pointer" }}
      >
        <input
          type="file"
          ref={inputFileRef}
          id={id.current}
          hidden
          accept={accept}
          //   onChange={handleFile}
        ></input>
        <div className="flex flex-row items-center justify-center gap-1 rounded-md border bg-slate-400 px-2 py-1">
          {loading ? <Spinner size="sm" /> : <FaFileUpload />}
          Import file
        </div>
      </label>
      {/* <div
        className='relative'
        onClick={() => {
          setIsOpen(true)
        }}
      >
        {children}
        <div className='absolute bottom-0 left-0 right-0 top-0 cursor-pointer' />
      </div> */}
      {/* <ReactSpreadsheetImport isOpen={isOpen} onSubmit={onSubmit} /> */}
    </>
  );
}
