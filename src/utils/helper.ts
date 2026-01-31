export function getExecutionDate(): string {
  const today = new Date();
  const day = today.getDay(); 
  // 0 = Sunday, 6 = Saturday

  const executionDate = new Date(today);

  if (day === 6) {
    // Saturday → Monday
    executionDate.setDate(today.getDate() + 2);
  } else if (day === 0) {
    // Sunday → Monday
    executionDate.setDate(today.getDate() + 1);
  }

  return executionDate.toISOString().split("T")[0];
}