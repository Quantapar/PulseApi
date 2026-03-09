import { prisma } from "../../db";

export async function pingEndpoint(endpoint: any) {
  const startTime = Date.now();
  let status = "DOWN";
  let statusCode: number | null = null;
  let responseTime = 0;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); 

    const res = await fetch(endpoint.url, {
      method: endpoint.method,
      signal: controller.signal,
      headers: {
        'User-Agent': 'PulseAPI-Monitor/1.0'
      }
    });

    clearTimeout(timeoutId);

    responseTime = Date.now() - startTime;
    statusCode = res.status;

    if (res.status === endpoint.expectedStatus) {
      status = "UP";
    }
  } catch (error) {
    responseTime = Date.now() - startTime;
  }


  await prisma.ping.create({
    data: {
      endpointId: endpoint.id,
      status,
      responseTime,
      statusCode,
    }
  });


  await prisma.endpoint.update({
    where: { id: endpoint.id },
    data: {
      status,
      lastCheckedAt: new Date(),
    }
  });

  console.log(`[Monitor] Pinged ${endpoint.name} (${endpoint.url}) - Status: ${status} - Time: ${responseTime}ms`);
}

let isChecking = false;

export function startMonitoringService() {
  console.log("[Monitor] Starting endpoint monitoring service...");
  
  setInterval(async () => {
    if (isChecking) return;
    isChecking = true;

    try {
      const endpoints = await prisma.endpoint.findMany();
      const now = new Date();
      
      const pingPromises: Promise<void>[] = [];

      for (const endpoint of endpoints) {
        let needsCheck = false;
        
        if (!endpoint.lastCheckedAt) {
           needsCheck = true;
        } else {
           const timeSinceLastCheckMs = now.getTime() - endpoint.lastCheckedAt.getTime();
        
           if (timeSinceLastCheckMs >= endpoint.interval * 1000) {
             needsCheck = true;
           }
        }

        if (needsCheck) {
          pingPromises.push(
            pingEndpoint(endpoint).catch((err) => console.error("[Monitor] Ping failed:", err))
          );
        }
      }
      
      if (pingPromises.length > 0) {
        await Promise.allSettled(pingPromises);
      }
    } catch (e) {
      console.error("[Monitor] Error in monitoring loop:", e);
    } finally {
      isChecking = false;
    }
  }, 5000); 
}
