FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install

COPY . .
RUN bunx prisma generate

EXPOSE 3000

CMD ["bun", "run", "index.ts"]
