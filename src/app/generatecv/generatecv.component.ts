import { Component, OnInit } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { first } from 'rxjs/operators';
import { firstValueFrom, forkJoin } from 'rxjs';
import { saveAs } from "file-saver";
import { CookieService } from 'ngx-cookie-service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-generatecv',
  templateUrl: './generatecv.component.html',
  styleUrls: ['./generatecv.component.css']
})
export class GeneratecvComponent implements OnInit {
  private apiKey = "AIzaSyCMXAvat00K2tYO3AvvbND5_Rb5GnE9wGs"; 
  private genAI = new GoogleGenerativeAI(this.apiKey);
  empId=this.cSerivce.get("username");
  constructor(
    private cSerivce:CookieService,
    private db:AngularFirestore,
    private router:Router,
    private Spinner:NgxSpinnerService
  ) { }

  ngOnInit(): void {
    if(!this.cSerivce.get("username")){
      this.router.navigateByUrl("login");
    }
  }
  async generateCV() {
    try {
      // ১. আপনার ডাটাবেজ থেকে ডাটা সংগ্রহ করুন (উদাহরণ হিসেবে দেওয়া হলো)
    this.Spinner.show();
    const registration$ = this.db.collection('employee_db').doc(this.empId).valueChanges().pipe(first());
    const education$ = this.db.collection('employee_education').doc(this.empId).valueChanges().pipe(first());
    const training$ = this.db.collection('trainingdatacollection').doc(this.empId).valueChanges().pipe(first());
    const experience$ = this.db.collection('EmployeeExperiences').doc(this.empId).valueChanges().pipe(first());
      
    const [reg, edu, train, exp]: any = await firstValueFrom(
      forkJoin([registration$, education$, training$, experience$])
    );
      const employeeData = {
        name: reg?.fullName || 'N/A', // Registration Details থেকে আসবে
        education: `SSC: ${edu?.sscGrade}, HSC: ${edu?.hscGrade}, Institution: ${edu?.gradInstitution}`, // Education Form থেকে আসবে
        training: train?.courseName || 'N/A', // Training Data থেকে আসবে
        experience: exp?.totalExperience || 'N/A' // Work Experience থেকে আসবে
      };

      // ২. জেমিনির জন্য প্রম্পট তৈরি করুন
      const prompt = `Act as a professional CV writer. Based on the following data, 
      create a well-structured and professional resume summary. 
      Data: ${JSON.stringify(employeeData)}. 
      Please provide the output in clear plain text sections.`;

      // ৩. জেমিনি এপিআই কল করা (মিনিটে ১৫টি রিকোয়েস্ট ফ্রি)
      // ১. মডেলের নামটি একদম নিখুঁতভাবে লিখুন
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash" 
      });

// ২. যদি উপরেরটি কাজ না করে, তবে 'latest' যোগ করে দেখুন
      const modelLatest = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest" 
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiText = response.text();
      this.Spinner.hide();
      // ৪. প্রাপ্ত টেক্সট দিয়ে ওয়ার্ড ফাইল তৈরি করা
      this.createWordDoc(aiText, employeeData.name);

    } catch (error) {
      console.error("CV জেনারেট করতে সমস্যা হয়েছে:", error);
      alert("দুঃখিত, এআই এই মুহূর্তে কাজ করছে না।");
    }
  }

  private createWordDoc(content: string, name: string) {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: `Curriculum Vitae of ${name}`,
            heading: HeadingLevel.HEADING_1,
            alignment: "center",
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: content,
                size: 24, // ১২ ফন্ট সাইজ
              }),
            ],
          }),
        ],
      }],
    });

    // ৫. ফাইলটি .docx ফরম্যাটে ডাউনলোড করা
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `CV_${name}.docx`);
      alert("আপনার সিভিটি সফলভাবে ডাউনলোড হয়েছে!");
    });
  }

}
