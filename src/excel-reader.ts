import 'dotenv/config';

import { writeFile } from 'fs/promises';
import { readFile, utils } from 'xlsx';
import { appDataSource } from './dataSource';
import { cityRepository, locationRepository } from './repos';

const formatArrayToSqlInsert = async (tableName: string, values: string[][]): Promise<void> => {
  const numberOfSlices = values.length / 1000;
  for (let index = 0; index < numberOfSlices; index++) {
    const slicedArray = values.slice(index * 1000, (index + 1) * 1000);
    const sqlFormattedArray = slicedArray.map(valueGroup => {
      valueGroup = valueGroup.map(value => {
        if (typeof value === 'string') {
          value = value.replace(/'/g, `''`).replace(/"/g, `""`);
          value = `N'${value}'`;
        } else if (!value) {
          value = 'null';
        }
        return value;
      });
      return `(${valueGroup.join(',')})`;
    });
    const filePath =
      tableName == 'institution'
        ? `src/sql/institutions/${tableName}-${index + 1}.sql`
        : `src/sql/${tableName}-${index + 1}.sql`;
    await writeFile(filePath, `INSERT INTO ${tableName} VALUES ${sqlFormattedArray}`);
  }
};

const excelToSqlStatements = async () => {
  const workbook = readFile(process.argv[2]);

  const locationSheet = workbook.Sheets[workbook.SheetNames[0]]; //מחוזות וערים;
  const locationJsonData: any[] = utils.sheet_to_json(locationSheet, { blankrows: false });
  const locations = [...new Set(locationJsonData.map(row => row.location))].filter(l => l).map(location => [location]);
  const cities = [...new Set(locationJsonData.map(row => row.city))].filter(l => l).map(city => [city]);

  const skillsSheet = workbook.Sheets[workbook.SheetNames[1]]; //סוגי התנדבות;
  const skillsJsonData: any[] = utils.sheet_to_json(skillsSheet, { blankrows: false });
  const skills = skillsJsonData.flatMap(skill => {
    skill.name = skill.name.split('\r\n').filter((name: string) => name && name != ' ');
    return skill.name.map((name: string) => [name, skill.type]);
  });

  const institutionSheet = workbook.Sheets[workbook.SheetNames[2]];
  const [locationsFromDb, citiesFromDb] = await Promise.all([locationRepository.find(), cityRepository.find()]);
  const institutionJsonData: any[] = utils.sheet_to_json(institutionSheet, { blankrows: false });

  const institutions = institutionJsonData.map(institution => {
    return [
      new Date().toISOString(),
      institution.name,
      institution.address,
      1,
      citiesFromDb.find(city => city.name == institution.city)?.id || 1,
      null,
      null
    ];
  });

  return await Promise.all([
    formatArrayToSqlInsert('location', locations),
    formatArrayToSqlInsert('city', cities),
    formatArrayToSqlInsert('skill', skills),
    formatArrayToSqlInsert('institution', institutions)
  ]);
};
appDataSource.initialize().then(() => {
  excelToSqlStatements();
});
