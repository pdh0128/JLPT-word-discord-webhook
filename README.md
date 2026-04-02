# JLPT Word Quiz Lambda

## Structure

```
├── index.js          # Lambda entry point
├── src/
│   ├── api.js       # JLPT Vocab API client
│   ├── quiz.js      # Quiz generation logic
│   ├── discord.js   # Discord webhook sender
│   └── handler.js   # Main Lambda handler
├── package.json
└── README.md
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DISCORD_WEBHOOK_URL` | Discord webhook URL (required) |

## Deploy

```bash
# Package for Lambda
zip -r jlpt-quiz.zip index.js src/

# Or use AWS CLI
aws lambda update-function-code --function-name jlpt-quiz --zip-file fileb://jlpt-quiz.zip
```

## EventBridge Schedule

Create a rule to trigger the Lambda daily:

```bash
aws events put-rule \
  --name jlpt-daily-quiz \
  --schedule-expression "cron(0 9 * * ? *)" \
  --state ENABLED

aws lambda add-permission \
  --function-name jlpt-quiz \
  --statement-id eventbridge-invoke \
  --action lambda:InvokeFunction \
  --principal events.amazonaws.com \
  --source-arn arn:aws:events:REGION:ACCOUNT:rule/jlpt-daily-quiz

aws events put-targets \
  --rule jlpt-daily-quiz \
  --targets TargetId=jlpt-quiz,Arn=arn:aws:lambda:REGION:ACCOUNT:function:jlpt-quiz
```

## Discord Webhook Setup

1. Go to Discord Server Settings → Integrations → Webhooks
2. Create a new webhook for the channel
3. Set `DISCORD_WEBHOOK_URL` environment variable in Lambda
