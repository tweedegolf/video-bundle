<?php

namespace TweedeGolf\VideoBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Faker\Generator;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use TweedeGolf\VideoBundle\Entity\Video;

class LoadVideoData extends AbstractFixture implements ContainerAwareInterface, OrderedFixtureInterface
{
    /**
     * @var int
     */
    const FAKE_VIDEO_COUNT = 3;

    /**
     * @var ContainerInterface
     */
    private $container;

    /**
     * @var Generator
     */
    private $faker;

    /**
     * @var array
     */
    public $randomVideos = [
        'zofBinqC2F4', 'H1iboKia3AQ', '9lh_becOt4Y', '6TwkVs6nhoY',
        'Ukugbb0Y72M', '6uhRxK_EOm4', 'IadsLclBOS8', 'A2_yg19Pu7Y',
        '2eAdXwZjHNA', 'IvjMgVS6kng', 'THnQTYqoDzg',
    ];

    /**
     * LoadFileData constructor.
     */
    public function __construct()
    {
        $this->faker = Factory::create();
    }

    /**
     * {@inheritdoc}
     */
    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }

    /**
     * {@inheritdoc}
     */
    public function load(ObjectManager $manager)
    {
        $faker = $this->faker;

        for ($i = 0; $i < self::FAKE_VIDEO_COUNT; $i += 1) {

            $randomElement = $faker->randomElement($this->randomVideos);
            $url = 'https://www.youtube.com/watch?v=' . $randomElement;
            $thumbnail = 'https://i.ytimg.com/vi/' . $randomElement . '/default.jpg';

            $video = new Video();
            $video->setName($faker->text(15));
            $video->setDescription($faker->text(500));
            $video->setUrl($url);
            $video->setThumbnail($thumbnail);
            $video->setYoutubeId($randomElement);
            $this->addReference('video-'.$i, $video);
            $manager->persist($video);
        }

        $manager->flush();
    }

    /**
     * Load videos first.
     */
    public function getOrder()
    {
        return 2;
    }
}
