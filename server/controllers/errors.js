const errorData = (status, title, description, fields) => ({
  status,
  title,
  description,
  fields,
});

const errors = {
  serverError: res => res.status(500).json({
    error: errorData(500, 'INTERNAL_SERVER_ERROR', 'something unexpected occured. try again later')
  }),

  validationError: (res, errObj) => res.status(422).json({
    error: errorData(422, 'FIELDS_VALIDATION_ERROR', 'one or more fields raised validation error', errObj)
  }),

  errorNotFound: (res, description) => res.status(404).json({
    error: errorData(404, 'ERROR_NOT_FOUND', description)
  }),

  forbidden: (res, description) => res.status(403).json({
    error: errorData(403, 'ACTION_NOT_ALLOWED', description)
  }),

  unauthorizedError: res => res.status(401).json({
    error: errorData(401, 'UNAUTHOURIZED_ACCESS', 'an access token or other authorization credential is required')
  }),

  badRequestError: (res, description) => res.status(400).json({
    error: errorData(400, 'BAD_REQUEST', description)
  }),
  confictError: (res, description) => res.status(409).json({
    error: errorData(409, 'CONFLICT_ERROR', description)
  })
};

export default errors;
