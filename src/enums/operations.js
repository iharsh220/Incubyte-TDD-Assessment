const Operation = Object.freeze({
  ADDITION: 'addition',
  MULTIPLICATION: 'multiplication'
});

const OperationSymbols = Object.freeze({
  '+': Operation.ADDITION,
  '*': Operation.MULTIPLICATION,
  'default': Operation.ADDITION
});

module.exports = {
  Operation,
  OperationSymbols
};
