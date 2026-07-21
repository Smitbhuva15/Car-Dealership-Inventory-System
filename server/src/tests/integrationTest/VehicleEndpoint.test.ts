import { connect,clearDatabase,closeDatabase } from "../../test-utils/db-handler.js";

beforeAll(async () => await connect());        // Setup once before all tests
afterAll(async () => await closeDatabase());   // Cleanup after all tests
beforeEach(async () => await clearDatabase()); // Clean before each test