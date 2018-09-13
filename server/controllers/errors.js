const errors = {
  validationError: (res, errObj) => res.status(422).json({
    error: {
      status: 422,
      title: 'FIELDS_VALIDATION_ERROR',
      description: 'one or more field raised validation error',
      fields: errObj,
    },
  }),
  errorNotFound: res => res.status(404).json({
    error: {
      status: 404,
      title: 'ERROR_NOT_FOUND',
      description: 'resource does not exist',
    },
  }),
  forbidden: (res, description) => res.status(403).json({
    error: {
      status: 403,
      title: 'ACTION_NOT_ALLOWED',
      description,
    },
  }),
};

export default errors;
