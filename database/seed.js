/* eslint-env node */

import { fakerEN_US as faker } from '@faker-js/faker'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY
)

const logErrorAndExit = (tableName, error) => {
  console.error(
    `An error occurred in table '${tableName}' with code ${error.code}: ${error.message}`
  )
  process.exit(1)
}

const logStep = stepMessage => {
  console.log(stepMessage)
}

// Create test users first
const createTestUsers = async () => {
  logStep('Creating test users...')

  const testUsers = [
    {
      email: 'user1@test.com',
      password: 'password123',
      username: 'user1',
      full_name: 'Test User 1'
    },
    {
      email: 'user2@test.com',
      password: 'password123',
      username: 'user2',
      full_name: 'Test User 2'
    },
    {
      email: 'user3@test.com',
      password: 'password123',
      username: 'user3',
      full_name: 'Test User 3'
    }
  ]

  const createdUserIds = []

  for (const user of testUsers) {
    // Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_metadata: { name: user.full_name },
        email_confirm: true
      })

    if (authError && authError.message !== 'User already registered') {
      console.log(`Auth user creation error: ${authError.message}`)
      continue
    }

    if (authData?.user?.id) {
      // Create profile
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: authData.user.id,
        username: user.username,
        full_name: user.full_name
      })

      if (profileError) {
        console.log(`Profile creation error: ${profileError.message}`)
      } else {
        createdUserIds.push(authData.user.id)
        console.log(
          `Created user: ${user.username} with ID: ${authData.user.id}`
        )
      }
    }
  }

  logStep(
    `Test users created successfully. Created ${createdUserIds.length} users.`
  )
  return createdUserIds
}

const seedProjects = async (numEntries, userIds) => {
  logStep('Seeding projects...')
  const projects = []

  for (let i = 0; i < numEntries; i++) {
    const name = faker.lorem.words(3)

    projects.push({
      name: name,
      slug: name.toLocaleLowerCase().replace(/ /g, '-'),
      description: faker.lorem.paragraph(2),
      status: faker.helpers.arrayElement(['in-progress', 'completed']),
      collaborators: faker.helpers.arrayElements(userIds, {
        min: 1,
        max: Math.min(3, userIds.length)
      })
    })
  }

  const { data, error } = await supabase
    .from('projects')
    .insert(projects)
    .select('id')

  if (error) return logErrorAndExit('Projects', error)

  logStep('Projects seeded successfully.')

  return data
}

const seedTasks = async (numEntries, projectsIds, userIds) => {
  logStep('Seeding tasks...')
  const tasks = []

  for (let i = 0; i < numEntries; i++) {
    tasks.push({
      name: faker.lorem.words(3),
      status: faker.helpers.arrayElement(['in-progress', 'completed']),
      description: faker.lorem.paragraph(2),
      due_date: faker.date.future(),
      profile_id: faker.helpers.arrayElement(userIds), // Add profile_id
      project_id: faker.helpers.arrayElement(projectsIds),
      collaborators: faker.helpers.arrayElements(userIds, {
        min: 1,
        max: Math.min(3, userIds.length)
      })
    })
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert(tasks)
    .select('id')

  if (error) return logErrorAndExit('Tasks', error)

  logStep('Tasks seeded successfully.')

  return data
}

const seedDatabase = async numEntriesPerTable => {
  const userIds = await createTestUsers()

  if (userIds.length === 0) {
    console.error('No users were created. Cannot proceed with seeding.')
    process.exit(1)
  }

  const projectsIds = (await seedProjects(numEntriesPerTable, userIds)).map(
    project => project.id
  )
  await seedTasks(numEntriesPerTable, projectsIds, userIds)
}

const numEntriesPerTable = 10

seedDatabase(numEntriesPerTable)
