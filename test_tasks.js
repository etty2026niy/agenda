// Test script to verify task API functionality
const API_BASE_URL = "http://localhost:4000";

async function testTaskAPI() {
  try {
    // First, we need to authenticate. For testing, we'll assume a user exists
    console.log("Testing task API...");

    // Test creating a task
    const createResponse = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer test-token`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Test Task",
        description: "This is a test task",
        priority: "high",
        category: "Testing",
        status: "pending",
      }),
    });

    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log("Task created:", createData);

      // Test getting tasks
      const getResponse = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer test-token`,
          "Content-Type": "application/json",
        },
      });

      if (getResponse.ok) {
        const getData = await getResponse.json();
        console.log("Tasks retrieved:", getData);
      } else {
        console.log("Failed to get tasks:", getResponse.status);
      }
    } else {
      console.log(
        "Failed to create task:",
        createResponse.status,
        await createResponse.text(),
      );
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

// Run the test
testTaskAPI();
