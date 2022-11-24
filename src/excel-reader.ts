import { writeFile } from 'fs/promises';
import { readFile, utils } from 'xlsx';

const formatArrayToSqlInsert = async (tableName: string, values: string[][]): Promise<void> => {
  const sqlFormattedArray = values
    .map(valueGroup => `(${valueGroup.map(value => `N'${value.replace(`'`, `''`).trim()}'`).join(',')})`)
    .join(', ');
  await writeFile(`src/sql/${tableName}.sql`, `INSERT INTO ${tableName} VALUES ${sqlFormattedArray}`);
};

const excelToSqlStatements = async () => {
  const workbook = readFile(process.argv[2]);

  const locationSheet = workbook.Sheets[workbook.SheetNames[0]]; //מחוזות וערים;
  const locationJsonData: any[] = utils.sheet_to_json(locationSheet, { blankrows: false });
  const locations = [...new Set(locationJsonData.map(row => row.location))].map(location => [location]);
  const cities = [...new Set(locationJsonData.map(row => row.city))].map(city => [city]);

  const skillsSheet = workbook.Sheets[workbook.SheetNames[1]]; //סוגי התנדבות;
  const skillsJsonData: any[] = utils.sheet_to_json(skillsSheet, { blankrows: false });
  const skills = skillsJsonData.flatMap(skill => {
    skill.name = skill.name.split('\r\n').filter((name: string) => name && name != ' ');
    return skill.name.map((name: string) => [name, skill.type]);
  });

  return await Promise.all([
    formatArrayToSqlInsert('location', locations),
    formatArrayToSqlInsert('city', cities),
    formatArrayToSqlInsert('skill', skills)
  ]);
};

excelToSqlStatements();
