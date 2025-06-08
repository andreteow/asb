import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <main>
      <div className="bg-primary-700 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">About ASBhive</h1>
            <p className="mt-4 text-xl text-primary-100">A Hub of Innovation & Entrepreneurship Activities</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-primary-700 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                ASBhive serves as Malaysia's premier connection point in the entrepreneurial ecosystem, fostering
                collaboration, innovation, and sustainable growth. We bridge the gap between social enterprises,
                investors, and ecosystem builders to create meaningful impact across communities.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Through our comprehensive directory and networking platform, we enable stakeholders to discover,
                connect, and collaborate with organizations that share their vision for positive social and
                environmental change.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary-700 mb-3">Innovation & Entrepreneurship</h3>
                <p className="text-gray-700 leading-relaxed">
                  We champion innovative solutions to Malaysia's most pressing challenges, supporting entrepreneurs who
                  are building sustainable businesses with positive impact at their core.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary-700 mb-3">Ecosystem Building</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our platform strengthens the entrepreneurial ecosystem by facilitating connections between diverse
                  stakeholders, from early-stage startups to established impact investors.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary-700 mb-3">Knowledge Sharing</h3>
                <p className="text-gray-700 leading-relaxed">
                  We promote the exchange of ideas, best practices, and resources to accelerate learning and growth
                  within the impact economy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-primary-700 mb-3">Sustainable Impact</h3>
                <p className="text-gray-700 leading-relaxed">
                  Every organization in our directory is committed to creating lasting positive change, whether through
                  environmental sustainability, social inclusion, or economic empowerment.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-primary-700 mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                We envision a thriving Malaysian impact ecosystem where social enterprises, investors, and ecosystem
                builders work together seamlessly to address societal challenges and create sustainable solutions.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Through ASBhive, we aim to make Malaysia a regional leader in impact entrepreneurship, demonstrating how
                business can be a force for good while achieving financial sustainability and scalable impact.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-primary-700 mb-4">Join Our Community</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Whether you're a social entrepreneur looking for funding, an investor seeking impact opportunities, or
                an ecosystem builder supporting the next generation of changemakers, ASBhive is your gateway to
                Malaysia's impact economy.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <h4 className="font-bold text-primary-700 mb-2">Social Enterprises</h4>
                  <p className="text-sm text-gray-600">Showcase your impact and connect with supporters</p>
                </div>
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <h4 className="font-bold text-primary-700 mb-2">Investors</h4>
                  <p className="text-sm text-gray-600">Discover vetted impact investment opportunities</p>
                </div>
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <h4 className="font-bold text-primary-700 mb-2">Ecosystem Builders</h4>
                  <p className="text-sm text-gray-600">Support and accelerate impact ventures</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
