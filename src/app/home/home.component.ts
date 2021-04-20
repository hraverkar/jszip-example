import { Component, OnInit } from '@angular/core';
import * as JSZip from "JSZip";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public onSubmit(event:Event){
    event.preventDefault();
  }

  async onChangeFile(event:any){
    //const input = event.target;
    const input: DataTransfer = event.target as DataTransfer;
    const uploadedFile = input.files[0];

    if(!uploadedFile) return;

    try {
      const zip = await JSZip.loadAsync(uploadedFile);
      const isxlsxFile = (name: any)=> name.toLowerCase().endsWith(".xlsx");
      const fileInZip = Object.keys(zip.files);
      const firstxlsxFile = fileInZip.find(isxlsxFile);
      if(!firstxlsxFile) return window.alert("NO Excel file found");
      const xlsxData = await zip.file(firstxlsxFile)?.async("blob");
      const reader: FileReader = new FileReader();
        reader.readAsBinaryString(xlsxData);
        reader.onload = (e: any) => {
          const binarystr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);
          console.table(data);
        };
    } catch (error) {
      alert("somthing went wrong");
      console.error(error);
    }
  }
}
