<?php

namespace TweedeGolf\VideoBundle\Form;

use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Serializer\Serializer;
use TweedeGolf\VideoBundle\Entity\Video;
use TweedeGolf\VideoBundle\Normalizer\VideoNormalizer;

/**
 * Class VideoType.
 */
class VideoType extends AbstractType
{
    /**
     * @var
     */
    private $normalizer;

    /**
     * FileType constructor.
     *
     * @param VideoNormalizer $normalizer
     */
    public function __construct(VideoNormalizer $normalizer)
    {
        $this->normalizer = $normalizer;
    }

    /**
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'class' => 'TGVideoBundle:Video',
            'required' => true,
        ]);
    }

    /**
     * {@inheritdoc}
     */
    public function buildView(FormView $view, FormInterface $form, array $options)
    {
        $serializer = new Serializer([$this->normalizer]);
        $data = $form->getData();

        if ($data instanceof Video) {
            $data = new ArrayCollection([$data]);
        }

        $view->vars['options'] = json_encode([
            'multiple' => $options['multiple'],
            'name' => $view->vars['full_name'],
            'selected' => $serializer->normalize($data)
        ]);
    }

    /**
     * @return string
     */
    public function getParent()
    {
        return EntityType::class;
    }
}
