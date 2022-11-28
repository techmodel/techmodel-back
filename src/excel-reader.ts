import 'dotenv/config';

import { writeFile } from 'fs/promises';
import { readFile, utils } from 'xlsx';
import { appDataSource } from './dataSource';
import { cityRepository, locationRepository } from './repos';

const formatArrayToSqlInsert = async (tableName: string, values: string[][]): Promise<void> => {
  const sqlFormattedArray = values
    .map(
      valueGroup =>
        `(${valueGroup
          .map(
            value =>
              `N'${value
                .replace(/'/g, `''`)
                .replace(/"/g, `""`)
                .trim()}'`
          )
          .join(',')})`
    )
    .join(', ');
  await writeFile(`src/sql/${tableName}.sql`, `INSERT INTO ${tableName} VALUES ${sqlFormattedArray}`);
};

const excelToSqlStatements = async () => {
  const workbook = readFile(process.argv[2]);

  const locationSheet = workbook.Sheets[workbook.SheetNames[0]]; //מחוזות וערים;
  const locationJsonData: any[] = utils.sheet_to_json(locationSheet, { blankrows: false });
  // const locations = [...new Set(locationJsonData.map(row => row.location))].map(location => [location]);
  const cities = [...new Set(locationJsonData.map(row => row.city))].map(city => [city]);

  // const skillsSheet = workbook.Sheets[workbook.SheetNames[1]]; //סוגי התנדבות;
  // const skillsJsonData: any[] = utils.sheet_to_json(skillsSheet, { blankrows: false });
  // const skills = skillsJsonData.flatMap(skill => {
  //   skill.name = skill.name.split('\r\n').filter((name: string) => name && name != ' ');
  //   return skill.name.map((name: string) => [name, skill.type]);
  // });

  const institutionSheet = workbook.Sheets[workbook.SheetNames[2]];
  const [locationsFromDb, citiesFromDb] = await Promise.all([locationRepository.find(), cityRepository.find()]);
  const institutionJsonData: any[] = utils.sheet_to_json(institutionSheet, { blankrows: false });
  console.log(institutionJsonData);
  const institutions = institutionJsonData.map(institution => {
    return [
      institution.name,
      institution.address,
      locationsFromDb.find(location => location.name == institution.name)?.id,
      citiesFromDb.find(city => city.name == institution.city)?.id,
      null,
      null
    ];
  });

  return await Promise.all([
    // formatArrayToSqlInsert('location', locations),
    formatArrayToSqlInsert('city', cities),
    // formatArrayToSqlInsert('skill', skills),
    formatArrayToSqlInsert('institution', institutions)
  ]);
};
appDataSource.initialize().then(() => {
  excelToSqlStatements();
});
