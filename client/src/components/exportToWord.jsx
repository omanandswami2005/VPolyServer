import { Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow ,AlignmentType,PageOrientation, TableColumnWidth, TableWidthType, TextRun, Header,VerticalAlign, HorizontalAlign, WidthType,Footer,NumberFormat,PageNumber,TableLayoutType} from 'docx';
import { saveAs } from 'file-saver'; // For saving the file

const exportToWord = async (attendanceData, dates) => {
    // console.log(attendanceData)
    // console.log(dates)
    const doc = new Document({
        sections: [],

    });
    
    const rows = [];

    // Construct table rows
    rows.push(
        new TableRow({
            children: [
                new TableCell({width: { size: 4, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: 'Roll No' ,heading:HeadingLevel.HEADING_5,alignment: AlignmentType.CENTER})] }),
                new TableCell({width: { size: 12, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: 'Name',heading:HeadingLevel.HEADING_5,alignment: AlignmentType.CENTER })]}),

                ...dates.map(date => new TableCell({ children: [new Paragraph({ text: date.slice(0, 10).toString().slice(0,5) })] })),

                new TableCell({ children: [new Paragraph({ text: 'Total Attendance',heading:HeadingLevel.HEADING_5,alignment: AlignmentType.CENTER })] }),
                new TableCell({ children: [new Paragraph({ text: 'Defaulter',heading:HeadingLevel.HEADING_5 ,alignment: AlignmentType.CENTER})] })
            ],
            verticalAlign: VerticalAlign.CENTER,
            tableHeader: true
        })
    );

    attendanceData.forEach(student => {
        // console.log("Processing student:", student);
        const totalAttendance = student.attendance.filter(a => a.present).length;
        const totalDays = dates.length;
        const attendancePercentage = (totalAttendance / totalDays) * 100;
        const isDefaulter = attendancePercentage < 75;

        rows.push(
            new TableRow({
                alignment: 'center',
                children: [
                    new TableCell({ children: [new Paragraph({ text: student.rollNo.toString(),alignment: AlignmentType.CENTER
                         })] }),
                    new TableCell({ children: [new Paragraph({ text: student.studentName,alignment: AlignmentType.CENTER })] }),

                    ...dates.map(date => {
                        const attendance = student.attendance.find(a => {
                            const dateObj = new Date(a.date);
                            const formattedDate = dateObj.toLocaleDateString('en-GB'); // Format date as dd/mm/yy
                            return formattedDate === date;

                        });
                        const status = attendance ? (attendance.present ? 'P' : 'A') : '';
                        return new TableCell({ children: [new Paragraph({ text: status ,alignment: AlignmentType.CENTER})] });
                    }),
                    new TableCell({ children: [new Paragraph({ text: `P: ${totalAttendance} || A: ${totalDays-totalAttendance} (${attendancePercentage}%)`,alignment: AlignmentType.CENTER })] }),

                    new TableCell({ children: [new Paragraph({ text: isDefaulter ? 'Yes' : 'No',alignment: AlignmentType.CENTER })] })
                ]
            })
        );
    });

    const table = new Table({
        rows,
        columnWidths: [1000, 1000, ...Array(dates.length).fill(100)],
        width: { size: 100, type: WidthType.PERCENTAGE }, // Adjust width as needed
        layout:TableLayoutType.FIXED,
        
       });

    doc.addSection({
        properties: {
            page:
            {
                size: {
                    orientation: PageOrientation.LANDSCAPE,
                },
                pageNumbers: {
                    start: 1,
                    formatType: NumberFormat.DECIMAL,
                },
                margin: {
                    
                    right: 500,
                    left: 500,
                },
            }
        },
        children: [table],
        headers: {
            default: new Header({
                children: [new Paragraph("VAPM College of Polytechnic, Latur."+" "+"Date: " + new Date().toLocaleDateString())],
            }),
        },
        footers: {
            default: new Footer({
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [

                            new TextRun({
                                children: ["Page Number: ", PageNumber.CURRENT],
                            }),
                            new TextRun({
                                children: [" of ", PageNumber.TOTAL_PAGES],
                            }),
                        ],
                    }),

                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [new TextRun("...By VPolyServer")],

                    }),

                ],
                
                
            }),
        },
    });

    Packer.toBlob(doc).then((blob) => {
        // saveAs from FileSaver will download the file
        saveAs(blob, "example.docx");
    });

}

export default exportToWord;