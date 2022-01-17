declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveProperties(b: string[]): R;
    }
  }
}

export const toHaveProperties = (received: Object, propertyNames: string[]) => {
  const keys = Object.keys(received);
  const missingProperties: string[] = [];

  propertyNames.forEach((prop) => {
    if (keys.indexOf(prop) === -1) {
      missingProperties.push(prop);
    }
  });

  const getMessage = () => {
    return `Expected [${keys}] to have the following properties [${missingProperties.join(
      ", "
    )}]`;
  };

  if (missingProperties.length === 0) {
    return {
      message: getMessage,
      pass: true,
    };
  }

  return {
    message: getMessage,
    pass: false,
  };
};

expect.extend({ toHaveProperties });
