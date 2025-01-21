const fs = require('fs');
const path = require('path');

const schemaFilePath = path.join(__dirname, 'prisma/schema.prisma');
const commonFields = `
  createDate      DateTime?
  createUserId    Int?
  ModifieldDate   DateTime?
  ModifieldUserId Int?
`;

fs.readFile(schemaFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const models = data.split('model ').slice(1).map(model => {
    const [modelName, modelContent] = model.split('{');
    const updatedModelContent = modelContent.replace('}', `${commonFields}\n}`);
    return `model ${modelName} {\n${updatedModelContent}`;
  });

  const updatedSchema = models.join('\n\n');
  fs.writeFile(schemaFilePath, updatedSchema, 'utf8', err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Schema updated with common fields.');
  });
});
