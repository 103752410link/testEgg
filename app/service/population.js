const Service = require('egg').Service;
const fs = require('fs');
const xlsx = require('node-xlsx');


class populationService extends Service {
  async getData() {
    // 解析得到文档中的所有 sheet
    const sheets = xlsx.parse('app/data_sixth/A0301a.xls');
    if (sheets.length > 0) {
      const age = sheets[0];
      const dataAge = []; const dataMale = []; const dataFemale = []; const dataTotal = [];
      age.data.forEach(element => {
        if (element.length === 4) {
          dataAge.push(element[0]);
          dataMale.push(-element[2]);
          dataFemale.push(element[3]);
          dataTotal.push(element[1]);
        }
      });
      return {
        dataAge, dataMale, dataFemale, dataTotal,
      };
    }
  }
  async get2020Data() {
    // 解析得到文档中的所有 sheet
    const sheets = xlsx.parse('app/data_sixth/2020.xls');
    if (sheets.length > 0) {
      const age = sheets[0];
      const dataAge = []; const dataMale = []; const dataFemale = []; const dataTotal = [];
      age.data.forEach(element => {
        if (element.length === 4) {
          dataAge.push(element[0]);
          let male = 0,
            female = 0,
            total = 0;
          if (element[0] >= 50) {
            male = element[2] * (140 - element[0]) / 100;
            female = element[3] * (140 - element[0]) / 100;
            total = male + female;
          } else {
            male = element[2] * (100 - element[0] / 10) / 100;
            female = element[3] * (100 - element[0] / 10) / 100;
            total = male + female;
          }
          dataMale.push(-male);
          dataFemale.push(female);
          dataTotal.push(total);
        }
      });
      return {
        dataAge, dataMale, dataFemale, dataTotal,
      };
    }
  }
  async get2030Data() {
    // 解析得到文档中的所有 sheet
    const sheets = xlsx.parse('app/data_sixth/2030.xls');
    if (sheets.length > 0) {
      const age = sheets[0];
      const dataAge = []; const dataMale = []; const dataFemale = []; const dataTotal = [];
      age.data.forEach(element => {
        if (element.length === 4) {
          dataAge.push(element[0]);
          let male = 0,
            female = 0,
            total = 0;
          if (element[0] >= 50) {
            male = element[2] * (140 - element[0]) / 100;
            female = element[3] * (140 - element[0]) / 100;
            total = male + female;
          } else {
            male = element[2] * (100 - element[0] / 10) / 100;
            female = element[3] * (100 - element[0] / 10) / 100;
            total = male + female;
          }
          dataMale.push(-male);
          dataFemale.push(female);
          dataTotal.push(total);
        }
      });
      return {
        dataAge, dataMale, dataFemale, dataTotal,
      };
    }
  }
  async getFifthData() {
    // 解析得到文档中的所有 sheet
    const sheets = xlsx.parse('app/data_sixth/t0301.xls');
    if (sheets.length > 0) {
      const age = sheets[0];
      const dataAge = []; const dataMale = []; const dataFemale = []; const dataTotal = [];
      age.data.forEach(element => {
        if (element.length === 4) {
          dataAge.push(element[0]);
          dataMale.push(-element[2]);
          dataFemale.push(element[3]);
          dataTotal.push(element[1]);
        }
      });
      return {
        dataAge, dataMale, dataFemale, dataTotal,
      };
    }
  }
}

module.exports = populationService;
