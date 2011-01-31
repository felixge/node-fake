function ExpectationDiff(properties) {
  for (var property in properties) {
    this[property] = properties[property];
  }
}
module.exports = ExpectationDiff;

ExpectationDiff.scores = {
  'viaNew': 8,
  'inContext': 4,
  'withArgs': 2,
  'withArg': 1,
};

ExpectationDiff.between = function(expectedCall, fakeCall) {
  var diff = new ExpectationDiff();
  diff.perform(expectedCall, fakeCall);
  return diff;
};

ExpectationDiff.prototype.perform = function(expectedCall, fakeCall) {
  var errors = expectedCall
    .getExpectations()
    .sortDesc(ExpectationDiff._scoreCompareExpectations)
    .map('getError', fakeCall)
    .filter();

  //console.log(errors);
  throw errors.first();
};

ExpectationDiff._scoreCompareExpectations = function(a, b) {
  var scoreA = ExpectationDiff._scoreExpectation(a);
  var scoreB = ExpectationDiff._scoreExpectation(b);

  if (scoreA === scoreB) {
    return 0;
  }

  return (scoreA > scoreB)
    ? 1
    : -1;
};

ExpectationDiff._scoreExpectation = function(expectation) {
  var type = expectation.getType();
  var score = ExpectationDiff.scores[type];

  if (!score) {
    throw new Error('Cannot score unknown expectation: '+type);
  }

  return score;
};


//ExpectationDiff.prototype.perform = function() {
  //var fakeCall = this._fakeCall;
  //var expectation = this._expectation;
  //var scores = ExpectationDiff.similarityScores;

  //if (fakeCall.getFakeFunction() !== expectation.getFakeFunction()) {
    //return this._error = new Error('Expected a different call');
  //}

  //var similarity = 0;
  //var context = fakeCall.getContext();

  //if (expectation._new) {
    //var constructor = expectation.getFakeFunction().getDelegator();

    //if (!(context instanceof constructor)) {
      //return this._error = new Error('Expected to be called with new.');
    //}

    //similarity += scores.new;
  //}

  //if (expectation._context) {
    //if (context !== expectation._context) {
      //return this._error = new Error('Expected different context');
    //}
    //similarity += scores.context;
  //}

  //if (expectation._args) {
    //var args = fakeCall.getArgs();
    //if (args.length !== expectation._args.length) {
      //return this._error = new Error('Args count does not match');
    //}

    //for (var i = 0; i < args.length; i++) {
      //if (args[i] !== expectation._args[i]) {
        //return this._error = new Error('Expected different args');
      //}
    //}

    //similarity += scores.allArgs;
  //}

  //this._similarity = similarity;
//};

//ExpectationDiff.prototype.getExpectation = function() {
  //return this._expectation;
//};

//ExpectationDiff.prototype.isAcceptable = function() {
  //return !this._error;
//};

//ExpectationDiff.prototype.compare = function(diff) {
  //if (diff._similarity === this._similarity) {
    //return 0;
  //}

  //return (this._similarity < diff._similarity)
    //? -1
    //: 1;
//};
