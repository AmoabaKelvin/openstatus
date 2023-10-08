import type { z } from "zod";

import type {
  basicMonitorSchema,
  selectNotificationSchema,
} from "@openstatus/db/src/schema";

const postToWebhook = async (content: string, webhookUrl: string) => {
  await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content,
      avatar_url:
        "https://img.stackshare.io/service/104872/default_dc6948366d9bae553adbb8f51252eafbc5d2043a.jpg",
      username: "OpenStatus Notifications",
    }),
  });
};

export const sendDiscordMessage = async ({
  monitor,
  notification,
}: {
  monitor: z.infer<typeof basicMonitorSchema>;
  notification: z.infer<typeof selectNotificationSchema>;
}) => {
  const notificationData = JSON.parse(notification.data);
  const { discord: webhookUrl } = notificationData; // webhook url
  const { name } = monitor;

  try {
    await postToWebhook(
      `Your monitor ${name} is down 🚨

      Your monitor with url ${monitor.url} is down.`,
      webhookUrl,
    );
  } catch (err) {
    // Do something
  }
};

export const sendTestDiscordMessage = async (webhookUrl: string) => {
  try {
    await postToWebhook(
      "This is a test notification from OpenStatus. \nIf you see this, it means that your webhook is working! 🎉",
      webhookUrl,
    );
    return true;
  } catch (err) {
    return false;
  }
};