module.exports = {
  setupTestFrameworkScriptFile: '<rootDir>/spec/support/jest.setup.js',
  verbose: true,
  testMatch: ['<rootDir>/spec/unit/**/*.spec.js'],
  coverageThreshold: {
    global: {
      statements: 39,
      branches: 15,
      functions: 27,
      lines: 39,
    },
  },
  collectCoverageFrom: [
    'lib/client/app/**/*.{js,jsx}',
    '!lib/client/app/index.js',
    '!lib/client/app/store/**/*.js',
  ],
  coveragePathIgnorePatterns: ['/node_modules'],
  coverageDirectory: 'spec/coverage/',
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'spec/support/__mocks__/file.js',
    '\\.(css|scss|sass|less)$': 'identity-obj-proxy',
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testURL: 'http://localhost/',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'Small Tests',
        outputDirectory: 'spec/reports',
        outputName: './jest-output.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' ',
      },
    ],
  ],
  restoreMocks: true,
};
