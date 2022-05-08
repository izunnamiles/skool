const { QueryTypes } = require("sequelize");
const { validateDeptInput } = require("../helpers/validate");
const Department = require("../models/Department");

exports.departments = async (req, res) => {
  const departments = await Department.findAll().catch(err => console.log(err));
  res.json({
    message: 'records fetched',
    departments
  })
}

exports.findDepartment = async (req, res) => {
  const department = await Department.findByPk(req.params.id).catch(err => console.log(err));
  res.json({
    message: 'records fetched',
    data: department
  })
}

exports.createDepartment = async (req, res) => {
  let depts = req.body;
  if (!Array.isArray(req.body)) {
    let data = [];
    data.push(req.body)
    depts = data;
  }
  depts.forEach((dept, index) => {
    const { error } = validateDeptInput(dept)
    if (error) {
      res.status(422).json({
        message: error.details[0].message.replace(/"([^"]+(?="))"/g, '$1')+` in ${index+1} array`
      })
    } 
  })
  await Department.bulkCreate(depts)
    .then(() => res.status(201).json({
      message: 'Department(s) saved successfully'
    }))
    .catch(err => console.log(err));
}

exports.searchDepartment = async (req, res) => {
  let q = `${req.query.q}%`;
  const search = await sequelize.query(
    'SELECT id, first_name, last_name, email FROM departments WHERE first_name LIKE :q OR last_name LIKE :q',
    {
      replacements: { q: query },
      type: QueryTypes.SELECT
    }
  ).catch(err => console.log(err));
  if (search == null || typeof search == 'undefined') {
    res.status(404).json({
      message: 'No record found'
    });
  } else {
    res.json({
      message: 'Record fetched',
      data:search
    });
  }
}

exports.update = async (req, res) => {
  const dept = await Department.findByPk(req.params.id)
  .catch(err => console.log(err));
  if (dept === null) {
    res.status(422).json({ message: 'Department does not exist'});
  }
  const updateDept = {
    name: req.body.name ? req.body.name : dept.name,
    description: req.body.description ? req.body.description : dept.description,
  }
    
  const { error, value } = updateValidtion(updateDept);
  if (error) res.status(422).json({
    message: error.details[0].message.replace(/"([^"]+(?="))"/g, '$1')
  })

  Object.assign(dept, value);
  await dept.save()
  .then(() => {
    res.json({
      message: "Record updated"
    })
  })
  .catch(err => console.log(err));
}
exports.getDeptTutors = (req, res) => {
  //
}