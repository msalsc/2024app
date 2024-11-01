import pino, { TransportTargetOptions } from "pino";

export const createLogger = ({
  name,
  level,
  logtail_token,
}: {
  name: string;
  level: string;
  logtail_token?: string;
}) => {
  const targets: TransportTargetOptions[] = [
    {
      level: "debug",
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  ];

  if (logtail_token) {
    targets.push({
      level: "info",
      target: "@logtail/pino",
      options: { sourceToken: logtail_token },
    });
  }

  const transport = pino.transport({
    targets,
  });

  const logger = pino({ name, level }, transport);

  return logger;
};
